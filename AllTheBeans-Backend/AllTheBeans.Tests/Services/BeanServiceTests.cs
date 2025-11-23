using AllTheBeans.Application.Services;
using AllTheBeans.Domain.Entities;
using AllTheBeans.Domain.Interfaces;
using FluentAssertions;
using Moq;
using Xunit;

namespace AllTheBeans.Tests.Services;

public class BeanServiceTests
{
    private readonly Mock<IBeanRepository> _mockRepo;
    private readonly BeanService _service;

    public BeanServiceTests()
    {
        _mockRepo = new Mock<IBeanRepository>();
        _service = new BeanService(_mockRepo.Object);
    }

    [Fact]
    public async Task GetBeanOfTheDay_ShouldReturnExisting_IfCreatedToday()
    {
        // Arrange
        var today = DateTime.UtcNow.Date;
        var existingLog = new CoffeeBean { Id = 1, Name = "Existing Bean" };
        
        _mockRepo.Setup(r => r.GetBotdAsync(today))
            .ReturnsAsync(existingLog);

        // Act
        var result = await _service.GetBeanOfTheDayAsync();

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(1);
        result.Name.Should().Be("Existing Bean");
        // Verify we didn't try to create a new one
        _mockRepo.Verify(r => r.AddBotdAsync(It.IsAny<BeanOfTheDay>()), Times.Never);
    }

    [Fact]
    public async Task GetBeanOfTheDay_ShouldCreateNew_IfNoneToday()
    {
        // Arrange
        var today = DateTime.UtcNow.Date;
        var availableBeans = new List<CoffeeBean> 
        { 
            new() { Id = 10, Name = "New Bean" } 
        };

        _mockRepo.Setup(r => r.GetBotdAsync(today)).ReturnsAsync((CoffeeBean?)null);
        _mockRepo.Setup(r => r.GetBotdAsync(today.AddDays(-1))).ReturnsAsync((CoffeeBean?)null); // No yesterday log
        _mockRepo.Setup(r => r.GetBeansExcludingAsync(0)).ReturnsAsync(availableBeans);

        // Act
        var result = await _service.GetBeanOfTheDayAsync();

        // Assert
        result.Id.Should().Be(10);
        // Verify we saved the log
        _mockRepo.Verify(r => r.AddBotdAsync(It.Is<BeanOfTheDay>(l => l.CoffeeBeanId == 10)), Times.Once);
    }
}